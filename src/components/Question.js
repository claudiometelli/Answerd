import React, { Component } from 'react';
import './../css/App.css';

/**
 * Classe che rappresenta una domanda da visualizzare
 */
class Question extends Component {

  /**
   * Costruttore che inizializza i parametri del tempo massimo per ogni domanda in millisecondi e lo stato, che contiene:
   * .time: tempo attuale trascorso;
   * .isOn: booleano che indica se il timer è in funzione;
   * .start: partenza;
   * .per: percentuale di progressione della barra del tempo;
   */
  constructor() {
    super();
    this.maxTime = 15000;
    this.state = {
      time: 0,
      isOn: false,
      start: 0,
      per: 0
    }
  }

  /**
   * Se il timer non è attivo porta alla situazione iniziale elementi grafici come i bottoni o la barra del tempo, fa partire il timer e lo aggiorna ogni 20 millisecondi
   */
  initialSet() {
    if(!this.state.isOn && this.state.time === 0){
      document.getElementById('progressBar').style.backgroundColor = 'white';
      document.getElementById('filler').style.backgroundColor = '#0d47a1';
      if(this.props.type === 'multiple')
        for(var i=0;i<4;i++)
          document.getElementById("b"+i).style.backgroundColor = "#008CBA";
      else{
        document.getElementById("b"+4).style.backgroundColor = "#008CBA";
        document.getElementById("b"+5).style.backgroundColor = "#008CBA";
      }
      this.setState({
        isOn: true,
        time: this.state.time,
        start: Date.now() - this.state.time
      });
      this.timer = setInterval(() => {
        this.setState({
          time: Date.now() - this.state.start,
          per: this.state.time / (this.maxTime / 100)
        });
      }, 20);
    }
  }

  /**
   * Quando il componente viene caricato viene chiamato il metodo initialSet
   */
  componentDidMount() {
    this.initialSet();
  }

  /**
   * Quando il componente viene aggiornato viene chiamato il metodo initialSet
   */
  componentDidUpdate() {
    this.initialSet();
    if (this.state.time >= this.maxTime && this.state.isOn) {
      if(this.props.type === 'multiple')
          for(var i = 0; i < 4; i++){
            if(document.getElementById('b' + i).value === this.props.correct_answer)
              document.getElementById('b' + i).style.backgroundColor = 'green';
          }
      else{
        if(document.getElementById('b4').value === this.props.correct_answer)
          document.getElementById('b4').style.backgroundColor = 'green';
        else
        document.getElementById('b5').style.backgroundColor = 'green';
      }
      this.props.answerCallback('incorrect', this.maxTime, this);
      document.getElementById('progressBar').style.backgroundColor = 'black';
      document.getElementById('filler').style.backgroundColor = 'black';
      this.stopTimer();
    }
  }

  /**
   * Ferma il timer quando si torna alla partita
   */
  componentWillUnmount() {
    this.stopTimer();
  }

  /**
   * Verifica la correttezza della risposta e chiama la callback in App, inoltre illumina i bottoni di rosso e di verde a seconda della risposta e colora la progressBar edinfine stoppa il timer
   * @param {string} answer - la corretteza della domanda(può assumere i valori 'correct' oppure 'incorrect').
   * @param {string} id - id del bottone premuto
   */
  checkAnswer(answer, id) {
    if(this.state.isOn){
      if (answer === this.props.correct_answer){
        document.getElementById(id).style.backgroundColor = 'green';
        this.props.answerCallback('correct', this.state.time, this);
      }
      else{
        if(this.props.type === 'multiple'){
          document.getElementById(id).style.backgroundColor = '#ff3333';
          for(var i = 0; i < 4; i++){
            if(document.getElementById('b' + i).value === this.props.correct_answer)
              document.getElementById('b' + i).style.backgroundColor = 'green';
          }
        }
        if(this.props.type === 'boolean'){
          if(document.getElementById('b4').value === this.props.correct_answer){
            document.getElementById('b4').style.backgroundColor = 'green';
            document.getElementById('b5').style.backgroundColor = '#ff3333';
          }
          else{
            document.getElementById('b4').style.backgroundColor = '#ff3333';
            document.getElementById('b5').style.backgroundColor = 'green';
          }
        }
        this.props.answerCallback('incorrect', this.state.time, this);
      }
      document.getElementById('progressBar').style.backgroundColor = 'black';
      document.getElementById('filler').style.backgroundColor = 'black';
      this.stopTimer();
    }
  }

  /**
   * Resetta il Timer
   */
  resetTimer() {
    this.setState({
      time: 0,
      isOn: false
    });
  }

  /**
   * Ferma il Timer
   */
  stopTimer() {
    this.setState({
      isOn: false
    });
    clearInterval(this.timer);
  }

  /**
   * Il metodo render renderizza la domanda diversamente a seconda che sia una domanda a scelta multipla oppure booleana
   */
  render() {
  if (this.props.type === 'multiple')
      return (
        <div>
        <ProgressBar per={this.state.per} />
          <div className="row m-2">
            <p className="col">Category: {this.props.category}</p>
            <p className="col-2">Actual: {this.props.index}</p>
          </div>
          <div className="border m-5 p-5 border-primary sfumatino">
            <h1 className="font-weight-bold text-center m-7 text-white">{this.props.question}</h1>
          </div>

          <div className="row">
            <button id="b0" className="col asdini m-3" onClick={e => this.checkAnswer(this.props.answers[0],"b0")} value={this.props.answers[0]}>
            {this.props.answers[0]}
            </button>
            <button id="b1" className="col asdini m-3" onClick={e => this.checkAnswer(this.props.answers[1], "b1")} value={this.props.answers[1]}>
            {this.props.answers[1]}
            </button>
            <div className="w-100"></div>
            <button id="b2" className="col asdini m-3" onClick={e => this.checkAnswer(this.props.answers[2], "b2")} value={this.props.answers[2]}>
            {this.props.answers[2]}
            </button>
            <button id="b3" className="col asdini m-3" onClick={e => this.checkAnswer(this.props.answers[3], "b3")} value={this.props.answers[3]}>
            {this.props.answers[3]}
            </button>
          </div>
        </div>
      );
    else if (this.props.type === 'boolean')
      return (
        <div>
            <ProgressBar per={this.state.per} />
          <div className="row m-2">
            <p className="col">Category: {this.props.category}</p>
            <p className="col-2">Actual: {this.props.index}</p>
          </div>
          <div className="border m-5 p-5 border-primary sfumatino">
            <h1 className="font-weight-bold text-center m-7 text-white">{this.props.question}</h1>
          </div>
          <div className="row">
            <button id="b4" className="col asdini m-3" onClick={e => this.checkAnswer('True', "b4")}>True</button>
            <button id="b5" className="col asdini m-3" onClick={e => this.checkAnswer('False', "b5")}>False</button>
          </div>
        </div>
      );
  }
}

/**
 * Componente della barra totale del timer
 */
const ProgressBar = (props) => {
  return (
    <div className="progress-bar" id='progressBar'>
      <Filler percentage={props.per} />
    </div>
  )
}

/**
 * Componente della barra in avanzamento del timer
 */
const Filler = (props) => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} id='filler' />
}

export default Question;