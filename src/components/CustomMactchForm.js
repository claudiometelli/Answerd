import React, { Component } from 'react';

/**
 * Classe che rappresenta un form di input per effettuare una partita personalizzata
 */
class CustomMactchForm extends Component {

    /**
     * Costruisce la stringa per effettuare la chiamata alle API
     * @param {number} n - il numero di domande a cui si vuole rispondere.
     * @return {stringa} la stringa per effettuare la chiamata alle API.
     */
    requestStr = (n) => {
      let category = '';
      let difficulty = '';
      let type = '';
      if(document.getElementById("category").value !== 'any')
        category = '&category=' + document.getElementById("category").value;
      if(document.getElementById("difficulty").value !== 'any')
        difficulty = '&difficulty=' + document.getElementById("difficulty").value;
      if(document.getElementById("type").value !== 'any')
        type = '&type=' + document.getElementById("type").value;
      return('amount=' + n + category + difficulty + type);
    }

    /**
     * Controlla che non ci siano errori di input e nel caso non ve ne siano chiama la callback requestReturned in App passando i dati raccolti
     */
    control(){
        let n = document.getElementById('n_questions').value;
        let errorLbl = document.getElementById('errorLbl');
        errorLbl.innerHTML = '';
        if(n < 1 || n > 50)
          errorLbl.innerHTML = 'Inserisci un numero tra 1 e 50';
        else
          this.props.requestReturned(this.requestStr(n), document.getElementById("category").value, document.getElementById("difficulty").value, document.getElementById("type").value);
    }
    
    /**
     * Metodo render che renderizza il form di input con i dati
     */
    render() {
        return (
          <div className="container text-white font-weight-bold">
              <div className="form-group m-1">
                <label>QUESTION COUNT:</label>
                <input type="number" id="n_questions" className="form-control" defaultValue="10"/>
                <label id="errorLbl"></label>
              </div>
              
              <div className="form-group">
                <label>CATEGORY</label>
                <select id="category" className="form-control">
                  <option value="any">Any Category</option>
                  <option value="9">General Knowledge</option>
                  <option value="10">Entertainment: Books</option>
                  <option value="11">Entertainment: Film</option>
                  <option value="12">Entertainment: Music</option>
                  <option value="13">Entertainment: Musicals &amp; Theatres</option>
                  <option value="14">Entertainment: Television</option>
                  <option value="15">Entertainment: Video Games</option>
                  <option value="16">Entertainment: Board Games</option>
                  <option value="17">Science &amp; Nature</option>
                  <option value="18">Science: Computers</option>
                  <option value="19">Science: Mathematics</option>
                  <option value="20">Mythology</option>
                  <option value="21">Sports</option>
                  <option value="22">Geography</option>
                  <option value="23">History</option>
                  <option value="24">Politics</option>
                  <option value="25">Art</option>
                  <option value="26">Celebrities</option>
                  <option value="27">Animals</option>
                  <option value="28">Vehicles</option>
                  <option value="29">Entertainment: Comics</option>
                  <option value="30">Science: Gadgets</option>
                  <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
                  <option value="32">Entertainment: Cartoon &amp; Animations</option>
                </select>
              </div>

              <div className="form-group">
              <label>DIFFICULTY:</label>
                <select id="difficulty" className="form-control">
                  <option value="any">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>TYPE:</label>
                <select id="type" className="form-control">
                  <option value="any">Any Type</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True / False</option>
                </select>
              </div>

              <button type="submit" className="buttono w-100" onClick={(e) => this.control()}>START</button>
            </div>
        );
    }
}

export default CustomMactchForm;