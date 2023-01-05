import React from "react";
import Quiz from "./component/Quiz";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      category: null
    }
  }

  componentDidMount(){
    fetch('https://opentdb.com/api_category.php')
    .then((res)=> res.json())
    .then((data)=> this.setState({
        category:data
    }))
 }

  render(){
    return (
      <>
      <div >

      <Quiz category={this.state.category} />
      </div>
      
      </>
    )
  }

}

export default App;
