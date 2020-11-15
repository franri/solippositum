// SPDX-License-Identifier: MIT
pragma solidity 0.6.0;
pragma experimental ABIEncoderV2;

contract Apuesta {

  struct Evento {
    uint256 id;
    uint256 ratio; // mutiplicado por 10, por ejemplo 14 es 1.4
    uint256 cantidadApostada;
  }

  struct Apostado {
    uint256 cantidad;
    address payable apostador;
  }

  enum Estado {
    ApuestasAbiertas,
    ApuestasCerradas,
    EventoRecibido,
    PagosRealizados,
    PagosNoRealizados
  }

  Evento[] public events;
  mapping( uint256 => Apostado[] ) apuestas;
  mapping( uint256 => uint256 ) eventsIdx;

  string public nombre;
  address payable public organizador;
  address oraculo;

  uint256 eventoGanador;
  Estado public estado;

  mapping (uint256 => uint256) plataRequeridaPorApuesta;
  uint256 public plataRequerida;
  uint256 plataDelOrganizador;


  modifier onlyOraculo() {
    require(msg.sender == oraculo, "Sólo un oráculo puede realizar esta tarea.");
    _;
  }

  modifier onlyApuestasAbiertas() {
    require(estado == Estado.ApuestasAbiertas, "No se aceptan más apuestas.");
    _;
  }
  modifier onlyApuestasCerradas() {
    require(estado == Estado.ApuestasCerradas, "No se aceptan más apuestas.");
    _;
  }
  
  
  //event Print(uint256 i);
  //event Print(Apostado a);

  constructor(string memory name, uint256[][] memory outerEvents, address oraculoExterno) public {
    // outerEvents tiene en:
    //        0: id 4437
    //        1: ratio
    for (uint256 i = 0; i<outerEvents.length; i++){
      createEvent(i, outerEvents[i]);
    }
    nombre = name;
    organizador = msg.sender;
    oraculo = oraculoExterno;
    estado = Estado.ApuestasAbiertas;
  }

  function createEvent(uint256 i, uint256[] memory outerEvent) private {
    Evento memory e;
    e.id = outerEvent[0];
    e.ratio = outerEvent[1];
    events.push(e);
    eventsIdx[outerEvent[0]] = i;
    // apuestas[outerEvent[0]] = []; // no hace falta, hacer luego apuestas[idx].push para agregar

  }

  function registerBid(uint256 idEvento) public payable onlyApuestasAbiertas {
    // address, que va a ser msg.sender
    // id 4437
    // plata, que va a ser msg.value

    // registrar la apuesta
    Apostado memory apuesta = Apostado({cantidad: msg.value, apostador: msg.sender});
    getEvento(idEvento).cantidadApostada+=apuesta.cantidad;
    getApuestasDeEvento(idEvento).push(apuesta);

    // actualizar plata requerida
    plataRequeridaPorApuesta[idEvento]+=msg.value*(getEvento(idEvento).ratio)/10;
    if (plataRequeridaPorApuesta[idEvento] > plataRequerida){
      plataRequerida = plataRequeridaPorApuesta[idEvento];
    }

  }

  function cerrarApuestas() public onlyOraculo onlyApuestasAbiertas {
    estado = Estado.ApuestasCerradas;
  }

  function recibirEventoDelOraculo(uint256 eventoGanadorId) public onlyOraculo onlyApuestasCerradas {
    eventoGanador = eventoGanadorId;
    if ( plataDelOrganizador > plataRequerida ) {
      payBack();
      estado = Estado.PagosRealizados;
    } else {
      reimburse();
      estado = Estado.PagosNoRealizados;
    }
  }

  function payBack() private {
    Apostado[] storage a = getApuestasDeEvento(eventoGanador);
    // le pagamos a cada ganador
    //emit Print(a.length);
    for(uint i = 0; i < a.length; i++){
      Apostado storage apostado = a[i];
      //emit Print(apostado);
      //emit Print(apostado.cantidad * getEvento(eventoGanador).ratio/10);
      apostado.apostador.transfer(apostado.cantidad * getEvento(eventoGanador).ratio/10);
    }
    // le pagamos al organizador
    organizador.transfer(address(this).balance);
  }

  function reimburse() private {
    for ( uint i = 0; i < events.length; i++ ){
      Apostado[] memory apuestasDeEvento = getApuestasDeEvento(events[i].id);
      for ( uint j = 0; j < apuestasDeEvento.length; j++ ){
        Apostado memory a = apuestasDeEvento[j];
        a.apostador.transfer(a.cantidad);
      }
    }
    organizador.transfer(plataDelOrganizador);
    assert(address(this).balance == 0); // quedó plata en el contrato
  }

  function getEvento(uint256 id) private view returns ( Evento storage ) {
    return events[eventsIdx[id]];
  }

  function getApuestasDeEvento(uint256 id) private view returns ( Apostado[] storage ) {
    return apuestas[eventsIdx[id]];
  }

  function imprimirIdx(uint256 i) public view returns ( uint ) {
    return eventsIdx[i];
  }

  function getEventoByIdx(uint256 i) public view returns ( Evento memory ){
    return events[i];
  }

  function eventsLength() public view returns ( uint ) {
    return events.length;
  }

  function getEvents() public view returns ( Evento[] memory ){
    return events;
  }

  receive() external payable {
     if (msg.sender == organizador){
       plataDelOrganizador += msg.value;
     } else {
       revert();
     }
  }

  function cambiarNombre(string memory name) public {
    nombre = name;
  }
}
