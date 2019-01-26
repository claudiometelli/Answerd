import React, { Component } from 'react';

class Score extends Component {

  /**
   * Inserisce in memoria i dati dell' ultima partita personalizzata effettuata
   */
  calculateCustomMatchScore(){
    for(let i = 2; i  > 0; i--){
      localStorage.setItem('nQuestionsCustom_' + (i + 1), localStorage.getItem('nQuestionsCustom_' + i));
      localStorage.setItem('categoryCustom_' + (i + 1), localStorage.getItem('categoryCustom_' + i));
      localStorage.setItem('difficultyCustom_' + (i + 1), localStorage.getItem('difficultyCustom_' + i));
      localStorage.setItem('questionTypeCustom_' + (i + 1), localStorage.getItem('questionTypeCustom_' + i));
      localStorage.setItem('pointsCustom_' + (i + 1), localStorage.getItem('pointsCustom_' + i));
      localStorage.setItem('timeCustom_' + (i + 1), localStorage.getItem('timeCustom_' + i));
    }
    localStorage.setItem('nQuestionsCustom_1', this.props.nQuestions);
    localStorage.setItem('categoryCustom_1', this.props.category);
    localStorage.setItem('difficultyCustom_1', this.props.difficulty);
    localStorage.setItem('questionTypeCustom_1', this.props.questionType);
    localStorage.setItem('pointsCustom_1', this.props.points);
    localStorage.setItem('timeCustom_1', this.props.time);
  }

  /**
   * Calcola ed inserisce in posizione la partita se si è stabilito un record in una delle categorie predefinite
   */
  calculatePredefinedMatchScore(){
    let scores = [localStorage.getItem('points_' + this.props.type + '_1'), localStorage.getItem('points_' + this.props.type + '_2'), localStorage.getItem('points_' + this.props.type + '_3')];
    let times = [localStorage.getItem('time_' + this.props.type + '_1'), localStorage.getItem('time_' + this.props.type + '_2'), localStorage.getItem('time_' + this.props.type + '_3')];

    if(this.props.points > scores[0]){
      this.primo();
    }
    else if(this.props.points === scores[0]){
      if(this.props.points > scores[1]){
        //faccio un confronto con il primo
        if(this.props.time < times[0])
          this.primo();
        else
          this.secondo();
      }
      else if(this.props.points === scores[1]){
        if(this.props.points > scores[2]){
          //primo e secondo sono uguali al punteggio e confronto loro 3
          if(this.props.time < times[0])
            this.primo();
          else if(this.props.time < times[1])
            this.secondo();
          else
            this.terzo();
        }
        else if(this.props.points === scores[2]){
          // primo secondo terzo e punteggio sono uguali
          if(this.props.time < times[0])
            this.primo();
          else if(this.props.time < times[1])
            this.secondo();
          else if(this.props.time < times[2])
            this.terzo();
        }
      }
    }
    else if(this.props.points > scores[1]){
      this.secondo();
    }
    else if(this.props.points === scores[1]){
      if(this.props.points > scores[2]){
        //confronto con il secondo
        if(this.props.time < times[1])
          this.secondo();
        else
          this.terzo();
      }
      else if(this.props.points === scores[2]){
        //confronto tra due, tre e il punteggio
        if(this.props.time < times[1])
          this.secondo();
        else if(this.props.time < times[2])
          this.terzo();
      }
    }
    else if(this.props.points > scores[2]){
      this.terzo();
    }
    else if(this.props.points === scores[2]){
      //confronto con il terzo
      if(this.props.time < times[2])
          this.terzo();
    }
    

  }

  /**
   * Mette in prima posizione i dati della partita effettuata
   */
  primo(){
    localStorage.setItem('points_' + this.props.type + '_3', localStorage.getItem('points_' + this.props.type + '_2'));
    localStorage.setItem('time_' + this.props.type + '_3', localStorage.getItem('time_' + this.props.type + '_2'));
    localStorage.setItem('points_' + this.props.type + '_2', localStorage.getItem('points_' + this.props.type + '_1'));
    localStorage.setItem('time_' + this.props.type + '_2', localStorage.getItem('time_' + this.props.type + '_1'));
    localStorage.setItem('points_' + this.props.type + '_1', this.props.points);
    localStorage.setItem('time_' + this.props.type + '_1', this.props.time);
  }

  /**
   * Mette in seconda posizione i dati della partita effettuata
   */
  secondo(){
    localStorage.setItem('points_' + this.props.type + '_3', localStorage.getItem('points_' + this.props.type + '_2'));
    localStorage.setItem('time_' + this.props.type + '_3', localStorage.getItem('time_' + this.props.type + '_2'));
    localStorage.setItem('points_' + this.props.type + '_2', this.props.points);
    localStorage.setItem('time_' + this.props.type + '_2',  this.props.time);
  }

  /**
   * Mette in terza posizione i dati della partita effettuata
   */
  terzo(){
    localStorage.setItem('points_' + this.props.type + '_3', this.props.points);
    localStorage.setItem('time_' + this.props.type + '_3', this.props.time);
  }

  /**
   * Per non far visualizzare 'any' nel caso non sia stata scelta una particolare difficoltà
   * @param {string} str - la difficoltà del caso.
   * @return {string} la stringa che ti ho spiegato sopra zio.
   */
  converterOfAny = (str) => {
    if(str === 'any')
      return 'not setted';
    return str;
  }

  /**
   * Metodo che renderizza la pagina di visualizzazione dei punteggi a seconda che sia stata effettuata una partita custom oppure una predefinita
   */
  render() {
    if(this.props.type === 'personal'){
      this.calculateCustomMatchScore();
      return(
        <div>
          <h4>Your Score: {this.props.points}/{this.props.nQuestions}</h4>
          <h4>Total Time: {this.props.time / 1000}</h4>
          <h4>Your lasts scores in {this.props.type} macthes</h4>
          <p>
            {localStorage.getItem('pointsCustom_1')}/{localStorage.getItem('nQuestionsCustom_1')} answers in {localStorage.getItem('timeCustom_1') / 1000}s.<br />
            Difficulty was {this.converterOfAny(localStorage.getItem('difficultyCustom_1'))}
          </p>
          <p>
            {localStorage.getItem('pointsCustom_2')}/{localStorage.getItem('nQuestionsCustom_2')} answers in {localStorage.getItem('timeCustom_2') / 1000}s.<br />
            Difficulty was {this.converterOfAny(localStorage.getItem('difficultyCustom_2'))}
          </p>
          <p>
            {localStorage.getItem('pointsCustom_3')}/{localStorage.getItem('nQuestionsCustom_3')} answers in {localStorage.getItem('timeCustom_3') / 1000}s.<br />
            Difficulty was {this.converterOfAny(localStorage.getItem('difficultyCustom_3'))}
          </p>
        </div>
      );
    }
    else if(this.props.type === 'easy' || this.props.type === 'medium' || this.props.type === 'hard'){
      this.calculatePredefinedMatchScore();
      return(
        <div>
          <h4>Your Score: {this.props.points}/{this.props.nQuestions}</h4>
          <h4>Total Time: {this.props.time / 1000}s</h4>
          <h5>Type of your match: {this.props.type}</h5>
          <h5>Your best scores in {this.props.type} macthes</h5>
          <p>
            {localStorage.getItem('points_' + this.props.type + '_1')} answers in {localStorage.getItem('time_' + this.props.type + '_1') / 1000}s
          </p>
          <p>
            {localStorage.getItem('points_' + this.props.type + '_2')} answers in {localStorage.getItem('time_' + this.props.type + '_2') / 1000}s
          </p>
          <p>
            {localStorage.getItem('points_' + this.props.type + '_3')} answers in {localStorage.getItem('time_' + this.props.type + '_3') / 1000}s
          </p>
        </div>
      );
    }
  }
}

export default Score;