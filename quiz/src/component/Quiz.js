import React from  'react';

class Quiz extends React.Component {
    constructor(props){
        super(props)
        this.state={
         categoryID:null,
         difficulty:null,
         data:null,
         isOpen: false,
         step:0,
         results:false,
         selected:null,
         selectedA:[],
         currentQ: '',
         currentA:[],
         count:[],
         errMessage:'',
        }
    }


  handleCategory = (event) =>{
    const{value} =  event.target;
    this.setState({
        categoryID: value
    })
  }

  hanldeDifficulty = (event) =>{
   const {value} = event.target;
   this.setState({
    difficulty:value
   })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {step} = this.state
    fetch(`https://opentdb.com/api.php?amount=10&category=${this.state.categoryID}&difficulty=${this.state.difficulty}`).then((res) => res.json()).then((data)=> this.setState({
        data:data,
        currentQ:data.results[step].question,
        currentA:this.shuffle([...data.results[step].incorrect_answers, data.results[step].correct_answer]),
        isOpen:true
    }))
  }

  handleNext = () => {
    const {data, step,selected,selectedA,errMessage} = this.state;

    if(!selected ){
    this.setState({
        errMessage: 'select an valid input' ,
        step: step,
        results:false,
        isOpen:true,
        selectedA:[...!selectedA]
        
    })
    }
 
    else if(step <= 8 ){
        this.setState({
            step: step+1,
            currentQ:data.results[step+1].question,
            currentA:this.shuffle([...data.results[step+1].incorrect_answers, data.results[step+1].correct_answer]),
            
            
        })
    }
    else {
        this.setState({
            isOpen:false,
            results: true,
        })
    }
    this.setState({
        selectedA:[...selectedA, selected],
        selected:''
    })
  }

  handleSelect = (event) =>{
    const value = event.target.innerText;
 
    this.setState({
    selected: value,
    })
  }

   shuffle =(array) => {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  handleStart = () =>{
    const {selectedA, data,} = this.state
    this.setState({
        isOpen:false,
        results:false,
        selectedA:[],
        data:'',
        difficulty:'',
        categoryID:'',
        count:[],
        currentA:[],
        currentQ:'',
        step: 0


    })
  }

    render(){
        // const {data} = this.state
        // console.log(this.state.data)
        if(!this.props.category){
            return <h1>Fetching categories...</h1>
        } 
        const categories =  this.props.category.trivia_categories.map(item => item);

      if(this.state.isOpen && !this.state.results){
        const{data,step,currentA,currentQ,errMessage,selected} = this.state
     
     console.log(currentA,data)
        return (
            <>
               
            <div className='question-container '>
                <div >
                <strong> Question: {step+1}/10</strong> <br/>
                <progress className='progress-bar' max='10' value={step +1}></progress>
                </div>

                <h1 className='question'>{currentQ}</h1>

                 {currentA.map((ele,i)=> 
                 <p className={ ele === selected ? 'active-option': 'option'} onClick={this.handleSelect}
                 >{ele}</p>
                )  }
             
              
              <div className='question-btn'>

                <button className='btn'  onClick={this.handleNext}>Next</button>
              </div>
            </div>
    
         
            </>
        )
      }
      if(this.state.results && !this.state.isOpen ){
        const{data,selectedA,count} = this.state;
        { data.results.map((item,i)=> 
                        
            <td>{item.correct_answer === selectedA[i]? count.push(selectedA[i]).length: ''}
            </td>
            )  
        }
        return (
            <>
            <table className='table-container'>
                <thead>
                <tr>
                    <th>Questions</th>
                    <th>Correct Answers</th>
                    <th>You Selected</th>
                    <th>Right or Wrong</th>
                </tr>
                </thead>
                <tbody>
            { 
            data.results.map((item,i)=> 
            <tr>
                <td>{item.question}</td>
                <td>{item.correct_answer}</td>
              
                <td>{selectedA[i]}</td>
                <td className={item.correct_answer === selectedA[i]? 'correct': 'incorrect'}>
                    {item.correct_answer === selectedA[i]? 'True': 'False'}</td>
                </tr>
            )
            }
                </tbody>
                <tfoot>
                    <tr >
                    <th>Total Correct</th>
                    <th className='count'>{count.length}</th>
                    </tr>
                </tfoot>
            </table>
            <div className='result-btn table-container'>
            <button className='btn' onClick={this.handleStart}
            >Restart the Quiz</button>
            </div>
            </>
        )
      }

        return (
            <>
                <header className='header'>
            <div className='container' >
            <h1>Quiz</h1>
            </div>
                </header>
           
               <form  className='child-container flex'
                onSubmit={this.handleSubmit}>
            <legend className='legend'>Select Category:</legend>
              
                <select  className='select'
                 onChange={this.handleCategory}>      
                    <option selected>Any Category</option>
                    { categories.map(item =>  
                     <option value={item.id}>
                      {item.name}
                     </option>
                    )
                    }
                </select>
               
             
               
                <legend className='legend'>Select difficulty:</legend>
                <select className='select'
                 onChange={this.hanldeDifficulty}>
                    <option selected>Any Difficulty</option>
                    <option value= 'easy'>Easy</option>
                    <option value='medium'>Medium</option>
                    <option value='hard'>Hard</option>
                </select>
               <input className='btn-submit' type='submit'
               value='Submit'
                />
                </form> 

           
            </>
        )
    }
}

export default Quiz