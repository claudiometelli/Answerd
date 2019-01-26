import React, { Component } from 'react';
import './css/App.css';
import CustomMactchForm from './components/CustomMactchForm';
import Question from './components/Question';
import Score from './components/Score';

/**
* Classe App che richiama tutti gli altri componenti e che reinderizza il proprio contenuto nel file index.html e che effettua le chiamate alle API
 */
class App extends Component {

  /**
  * Costruttore della classe app, nel quale vengono settati alcuni parametri:
  * -questionsAmount: il numero totale di domande per le partite predefinite
  * -listJSX: che conterrà tutti i dati delle domande della chimata, in cui ogni elemento è un componente Question
  * -timeBetweenQuestions: il numero di millisecondi di intervallo tra una doamnda ed un altra
  * -exceptionsBeforeRendering: un array associativo che associa ad alcuni caratteri HTML i corrispetivi caratteri normalizzati, è usato in quanto i dati derivanti dalla chiamata contengono caratteri HTML che non verranno renderizzati e dunque si usa questo array associativo per la sostituzione dei caratteri(in caso di presenza di caratteri strani è possibile che siano caratteri HTML non presenti in exceptionsBeforeRendering perchè mai trovati nei test)
  * -state: lo stato react del componente, i cui parametri sono:
  * .localstate: usato per renderizzare la pagina nel render;
  * .rightAnswers: numero di domande corrette;
  * .actualQuestion: la domanda visibile al momento mentre si gioca;
  * .totaltime: il tempo totale di durata della partita;
  * .matchType: la tipologia di match(custom, easy, medium, hard);
  * .nQuestions: numero di domande della partita;
  * .category: la categoria specifica della domanda;
  * .difficulty: la difficoltà impostata del match;
  * .questionType: il tipo di domanda selezionato(boolean o a scelta multipla);
  * .yourScore: il punteggio finale della partita;
  * -infine, in quanto per la visualizzazione dei punteggi migliori è usata la memoria del browser, nel caso essa non sia mai stata utilizzata dall'app, essa setta i valori iniziali dei punteggi
   */
  constructor(){
    super();
    this.questionsAmount = 10;
    this.listJSX = {};
    this.timeBetweenQuestions = 2000;
    this.exceptionsBeforeRendering = {
      '&#039;' : "'",
      '	&lsquo;	' : '‘',
      '&rsquo;' : '’',
      '&quot;': '"',
      '&ldquo;': '“',
      '&rdquo;': '”',
      '&amp;' : '&',
      '&micro;': 'µ',
      '&Aacute;' : 'Á',
      '&atilde;' : 'ã',
      '&eacute;' : 'é',
      '&Ouml;' : 'Ö'
    };
    this.state = {
        localstate : 'home',
        rightAnswers : 0,
        actualQuestion : 0,
        totalTime : 0
    };
    if(localStorage.getItem('alreadySet') !== 'true'){
      localStorage.setItem('points_easy_1', 0);
      localStorage.setItem('points_easy_2', 0);
      localStorage.setItem('points_easy_3', 0);
      localStorage.setItem('points_medium_1', 0);
      localStorage.setItem('points_medium_2', 0);
      localStorage.setItem('points_medium_3', 0);
      localStorage.setItem('points__hard_1', 0);
      localStorage.setItem('points_hard_2', 0);
      localStorage.setItem('points_hard_3', 0);

      let maxTime = 150000;
      localStorage.setItem('time_easy_1', maxTime);
      localStorage.setItem('time_easy_2', maxTime);
      localStorage.setItem('time_easy_3', maxTime);
      localStorage.setItem('time_medium_1', maxTime);
      localStorage.setItem('time_medium_2', maxTime);
      localStorage.setItem('time_medium_3', maxTime);
      localStorage.setItem('time_hard_1', maxTime);
      localStorage.setItem('time_hard_2', maxTime);
      localStorage.setItem('time_hard_3', maxTime);

      localStorage.setItem('nQuestionsCustom_1', 0);
      localStorage.setItem('nQuestionsCustom_2', 0);
      localStorage.setItem('nQuestionsCustom_3', 0);
      localStorage.setItem('categoryCustom_1', 'any');
      localStorage.setItem('categoryCustom_2', 'any');
      localStorage.setItem('categoryCustom_3', 'any');
      localStorage.setItem('difficultyCustom_1', 'any');
      localStorage.setItem('difficultyCustom_2', 'any');
      localStorage.setItem('difficultyCustom_3', 'any');
      localStorage.setItem('questionTypeCustom_1', 'any');
      localStorage.setItem('questionTypeCustom_2', 'any');
      localStorage.setItem('questionTypeCustom_3', 'any');
      localStorage.setItem('pointsCustom_1', 0);
      localStorage.setItem('pointsCustom_2', 0);
      localStorage.setItem('pointsCustom_3', 0);
      localStorage.setItem('timeCustom_1', 0);
      localStorage.setItem('timeCustom_2', 0);
      localStorage.setItem('timeCustom_3', 0);

      localStorage.setItem('alreadySet', 'true');
    }
    //localStorage.clear();
  }

  /**
  * Callback utilizzata dal componente CustomMatchForm quando si vuole effettuare una partita custom, che sulla base dei dati ricevuti effettua la chiamata alle API tramite il metodo search
  * @param {string} requestStr - La stringa utilizzata per la chiamata API.
  * @param {number} category - La categoria di domande scelta.
  * @param {string} difficulty - La difficoltà del match.
  * @param {string} questionType - Il tipo di domande richiesto(boolean o multiple).
   */
  createPersonalRequestString = (requestStr, category, difficulty, questionType) => {
    this.search('https://opentdb.com/api.php?' + requestStr, 'personal', category, difficulty, questionType);
  }

  /**
   * Metodo utilizzato per la creazione di partite personalizzate e che tramite i dati in input effettua la chiamata alle API con il metodo search
   * @param {string} matchType - Il tipo di match che si sta per effettuare.
   */
  createRequestString(matchType){
    let requestStr = 'https://opentdb.com/api.php?amount=' + this.questionsAmount + '&difficulty=' + matchType;
    this.search(requestStr, matchType, 'any', matchType, 'any');
  }

  /**
   * Metodo che effettua la chiamata alle API attraverso i dati in input e che setta le domande in listJSX con il componente Question.
   * Inoltre attraverso l'array associativo exceptionsBeforeRendering vengono eliminati i caratteri HTML e viene mischiato l'ordine delle risposte nel caso la domanda sia a risposta multipla
   * @param {string} fetchStr - la stringa usata per la chiamata alle API.
   * @param {string} type - Il tipo di match che si sta per effettuare.
   * @param {number} category - La categoria di domande scelta.
   * @param {string} difficulty - La difficoltà del match.
   * @param {string} questionType - Il tipo di domande richiesto(boolean o multiple).
   */
  search(fetchStr, type, category, difficulty, questionType){
    fetch(fetchStr)
    .then(res => res.json())
    .then(body => {
      let i = 0;
      //console.log(body.results);
      this.listJSX = body.results.map(result => {
        i++;
        let quest = this.eliminateBeforeFetchRendering(result.question);
        let corr = this.eliminateBeforeFetchRendering(result.correct_answer);
        let incorr = result.incorrect_answers;
        let answers = [];
        if (result.type === 'multiple'){
          incorr[0] = this.eliminateBeforeFetchRendering(result.incorrect_answers[0]);
          incorr[1] = this.eliminateBeforeFetchRendering(result.incorrect_answers[1]);
          incorr[2] = this.eliminateBeforeFetchRendering(result.incorrect_answers[2]);
          let tmpAnswers = [];
          let n = Math.floor(Math.random() * 4)
          for (let i = 0; i < 4; i++) {
            if (i === n)
              tmpAnswers.push(corr);
            else {
              let a = incorr[Math.floor(Math.random() * 3)];
              while (tmpAnswers.includes(a))
                a = incorr[Math.floor(Math.random() * 3)];
              tmpAnswers.push(a);
            }
          }
          answers = tmpAnswers;
        }
        return(
          <Question category={result.category} question={quest} type={result.type}correct_answer={corr} incorrect_answers={incorr} answers={answers} index={i} answerCallback={this.callBack} />
        );
      });
      this.setState({
        localstate : 'playing',
        matchType : type,
        nQuestions : this.listJSX.length,
        category : category,
        difficulty : difficulty,
        questionType : questionType
      })
    })
  }

  /**
   * @param {string} str - la stringa da analizzare.
   * @return {string} La stringa senza caratteri HTML presenti in exceptionsBeforeRendering
   */
  eliminateBeforeFetchRendering(str){
    for(var ex in this.exceptionsBeforeRendering){
      while(str.includes(ex))
        str = str.replace(ex, this.exceptionsBeforeRendering[ex]);
    }
    return str;
  }

  /**
   * Callback utilizzata dal componente Question per verificare la correttezza della risposta e passare alla domanda successiva dopo il tempo stabilito da timeBetweenQuestions, resettando il timer della domanda.
   * @param {string} answer - la corretteza della domanda(può assumere i valori 'correct' oppure 'incorrect').
   * @param {number} time - il tempo utilizzato per rispondere alla domanda in questione.
   * @param {Question} qst - la domanda a cui si ha appena risposto.
   */
  callBack = (answer, time, qst) => {
    this.swagTimer = setTimeout(() => {
      qst.resetTimer();
      this.nextQuestion(answer, time);
    }, this.timeBetweenQuestions);
  }

  /**
   * Passa alla domanda successiva oppure alla pagina di visualizzazione dei punteggi.
   * @param {string} answer - la corretteza della domanda(può assumere i valori 'correct' oppure 'incorrect').
   * @param {string} time - il tempo utilizzato per rispondere alla domanda precedente.
   */
  nextQuestion(answer, time){
    if(this.state.actualQuestion === this.listJSX.length - 1){
      let tm = this.state.totalTime + time;
      let n = this.state.rightAnswers;
      if(answer === 'correct')
        n++;
      this.setState({
        localstate : 'finished',
        rightAnswers : 0,
        actualQuestion : 0,
        totalTime : tm,
        yourScore : n,
      })
    }
    else{
      let i = this.state.actualQuestion + 1;
      let tm = this.state.totalTime + time;
      let ans = this.state.rightAnswers;
      if(answer === 'correct')
        ans++;
      this.setState({
        localstate: 'playing',
        rightAnswers : ans,
        actualQuestion : i,
        totalTime : tm
      })
    }
  }

  /**
   * Metodo che fa tornare alla home resettando lo stato
   */
  backHome() {
    this.setState({
      localstate: 'home',
      rightAnswers : 0,
      actualQuestion : 0,
      totalTime : 0
    });
  }
  /**
   * Metodo render del componente react.
   * A seconda del valore localState nello state carica la pagina iniziale, la domanda attuale oppure la pagina di visualizzazione dei punteggi.
   */
  render() {
    if(this.state.localstate === 'home')
      return (
        <div className="container-fluid">
          <h1 className="titolo">ANSWERD</h1>
          <h1 className="text-center font-weight-bold text-white mt-5" >NORMAL MATCH</h1>
          <div className="row">
            <button className="buttono col" onClick={(e) => this.createRequestString('easy')}>EASY</button>
            <button className="buttono col" onClick={(e) => this.createRequestString('medium')}>MEDIUM</button>
            <button className="buttono col" onClick={(e) => this.createRequestString('hard')}>HARD</button>
          </div>
          <h1 className="text-center font-weight-bold text-white mt-5" >PERSONAL MATCH</h1>
          <CustomMactchForm requestReturned={this.createPersonalRequestString}/>
          <div className="col footer">
            © 2019 Copyright: Volonghi, Metelli, xXXxxX_€L1A_XXXxxx
          </div>
        </div>
      );
    else if(this.state.localstate === 'finished')
        return (
          <div className="container text-white text-center font-weight-bold">
            <Score type={this.state.matchType} nQuestions={this.state.nQuestions} category={this.state.category} difficulty={this.state.difficulty} questionType={this.state.questionType} points={this.state.yourScore} time={this.state.totalTime} />
            <button className="backhome" onClick={(e) => this.backHome()}>BACK HOME</button>
            <div className="col footer">
            © 2019 Copyright: Volonghi, Metelli, xXXxxX_€L1A!!11_XXXxxx
            </div>
          </div>
        );
    else if(this.state.localstate === 'playing')
      return (
        <div className="container text-white text-center font-weight-bold">          
          {this.listJSX[this.state.actualQuestion]}
          <p>Correct: {this.state.rightAnswers}/{this.listJSX.length}</p>
          <button  className="backhome mt-5 w-100" onClick={(e) => this.backHome()}>BACK HOME</button>
          <div className="col footer">
            © 2019 Copyright: Volonghi, Metelli, xXXxxX_€L1A_XXXxxx
          </div>
        </div>
      );
    }

}

export default App;