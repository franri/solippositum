// SPDX-License-Identifier: MIT
pragma solidity 0.6.0;
pragma experimental ABIEncoderV2;

contract Apuesta {

  event Print(uint256 p);

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
  address public oraculo;

  uint256 public eventoGanador;
  Estado public estado;

  mapping (uint256 => uint256) plataRequeridaPorApuesta;
  uint256 public plataRequerida;
  uint256 public plataDelOrganizador;


  modifier onlyOrganizador() {
      require(msg.sender == organizador, "Sólo un oráculo puede realizar esta tarea.");
      _;
    }

  modifier onlyOraculo() {
    require(msg.sender == oraculo, "Sólo un oráculo puede realizar esta tarea.");
    _;
  }

  modifier onlyApuestasAbiertas() {
    require(estado == Estado.ApuestasAbiertas, "No se aceptan más apuestas.");
    _;
  }
  modifier onlyApuestasCerradas() {
    require(estado == Estado.ApuestasCerradas, "Sólo correr luego de cerrar las apuestas.");
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
    events[eventsIdx[idEvento]].cantidadApostada+=apuesta.cantidad;
    apuestas[eventsIdx[idEvento]].push(apuesta);

    emit Print(msg.value);
    emit Print(apuesta.cantidad);
    emit Print(plataRequeridaPorApuesta[idEvento]);

    // actualizar plata requerida
    plataRequeridaPorApuesta[idEvento]+=(msg.value*(events[eventsIdx[idEvento]].ratio)/10);
    emit Print(plataRequeridaPorApuesta[idEvento]);
    if (plataRequeridaPorApuesta[idEvento] > plataRequerida){
      plataRequerida = plataRequeridaPorApuesta[idEvento];
    }
    emit Print(plataRequeridaPorApuesta[idEvento]);
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
    Apostado[] storage a = apuestas[eventsIdx[eventoGanador]];
    // le pagamos a cada ganador
    //emit Print(a.length);
    for(uint i = 0; i < a.length; i++){
      Apostado storage apostado = a[i];
      //emit Print(apostado);
      //emit Print(apostado.cantidad * getEvento(eventoGanador).ratio/10);
      apostado.apostador.transfer(apostado.cantidad * events[eventsIdx[eventoGanador]].ratio/10);
    }
    // le pagamos al organizador
    organizador.transfer(address(this).balance);
  }

  function reimburse() private {
    for ( uint i = 0; i < events.length; i++ ){
      Apostado[] memory apuestasDeEvento = apuestas[eventsIdx[events[i].id]];
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

  function getApuestasDeEvento(uint256 id) public view returns ( Apostado[] memory ) {
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
  function deposit() public payable onlyOrganizador {
    plataDelOrganizador += msg.value;
  }

  function cambiarNombre(string memory name) public {
    nombre = name;
  }

  function getPlatasRequeridas() public view returns ( uint256[][] memory ) {
    uint256[][] memory a = new uint256[][](events.length);
    for ( uint i = 0; i < events.length; i++ ){
      uint256[] memory b = new uint256[](2);
      b[0] = events[i].id;
      b[1] = plataRequeridaPorApuesta[events[i].id];
      a[i] = b;
    }
  }
}
