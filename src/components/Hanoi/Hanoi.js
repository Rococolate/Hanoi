import React, { Component, Children } from "react";
import "./Hanoi.css";
import Column from "../Column/Column";


export default class Hanoi extends Component {
  
  constructor(){
    super();
    this.state = { 
      columns:['Column1','Column2','Column3'],
      lock:false,
      step:0,
      Column1:[],
      Column2:[],
      Column3:[],
      st:'static', // static => catch => static
    };
  }

  componentWillMount(){
    this.initData();
  }

  initData(){
    let { level } = this.props;
    if (level > 0) {
      let Column1 = Array(level).join(',').split(',').map((item,index,array) => {
        return { 
          num : array.length - index,
          color : 'red'
        };
      });
      let Column2 = [];
      let Column3 = [];
      this.setState({
        Column1,
        Column2,
        Column3,
        step:0,
        st:'static', // static => catch => static
      });
    }  
  }

  clickFn(num){
    let list = [ 
      'Column1',
      'Column2',
      'Column3'
    ]
    return () => {
      const name = list[num];
      this.clickHigh(name);
    }
  }

  clickHigh(name){
    if ( this.state.lock ) return false;
    this.click(name);
  }

  timeoutClick(name){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        this.click(name);
        return resolve();
      },100);
    });
  }

  click(name){
    if ( this.state.st === 'static' ) {
      if ( this.state[name].length > 0 ) {
        this.state[name][this.state[name].length - 1].color = 'green';
        this.state.st = 'catch';
        this.setState({
          [name]:this.state[name],
          st:this.state.st
        });
      }
    } else if ( this.state.st === 'catch' ) {
      let catchItem = this.findCatch();
      if ( this.state[name].length === 0 || this.state[name][this.state[name].length - 1].num >= catchItem.num ) {
        [ this.state.Column1, this.state.Column2, this.state.Column3 ].forEach((item,index,array)=>{
          if ( item.length > 0 && item[item.length - 1] === catchItem ){ 
            array[index].pop();
          }
        });
        catchItem.color = 'red';
        this.state[name].push(catchItem);
        this.setState({
          Column1:this.state.Column1,
          Column2:this.state.Column2,
          Column3:this.state.Column3,
          st:'static',
          step:++this.state.step
        });
      }
    }
  }

  findCatch(){
    let list = [
      ...this.state.Column1,
      ...this.state.Column2,
      ...this.state.Column3
    ]

    return list.find((item) =>{
      return item.color === 'green';
    });
  }

  reset(){
    if ( this.state.lock ) return false;
    this.initData();
  }

  start(){  
    if ( this.state.lock ) return false;
    this.initData();
    setTimeout(()=>{
      this.setState({
        lock:true
      });
      this.script();
    },0);
  }

  script(){
    // this.move1toWhere('Column2')
    // this.move2toWhere('Column2')
    // this.move3toWhere('Column2')
    this.moveNtoWhere(7,'Column2').then(()=>console.log(1111));
  }

  moveNtoWhere(n,where){
    if ( n <= 1 ) return this.move1toWhere(where);
    let origin = this.findNum(n);
    let other = this.findOther(origin,where);
    return this.moveNtoWhere(n-1,other)
               .then(()=>this.timeoutClick(origin))
               .then(()=>this.timeoutClick(where))
               .then(()=>this.moveNtoWhere(n-1,where))
               .catch((err)=>{console.log(err)});
  }

  // move3toWhere(where){
  //   let origin = this.findNum(3);
  //   let other = this.findOther(origin,where);
  //   console.log('other',other)
  //   return this.move2toWhere(other)
  //              .then(()=>this.timeoutClick(origin))
  //              .then(()=>this.timeoutClick(where))
  //              .then(()=>this.move2toWhere(where))
  //              .catch((err)=>{console.log(err)});
  // }

  // move2toWhere(where){
  //   let origin = this.findNum(2);
  //   let other = this.findOther(origin,where);
  //   return this.move1toWhere(other)
  //              .then(()=>this.timeoutClick(origin))
  //              .then(()=>this.timeoutClick(where))
  //              .then(()=>this.move1toWhere(where))
  //              .catch((err)=>{console.log(err)});
  // }

  move1toWhere(where){
    let origin = this.findNum(1);
    return this.timeoutClick(origin).then(()=>this.timeoutClick(where)).catch((err)=>{console.log(err)});
  }

  findOther(origin,where){
    return this.state.columns.filter(item => item !== origin && item !== where)[0];
  }

  findNum(number){
    const nameList = this.state.columns;
    let name;
    [ this.state.Column1 , this.state.Column2 , this.state.Column3 ].forEach((item,index)=>{
      if ( item.find(el => el.num === number) !== undefined ) name = nameList[index];
    }); 
    return name;
  }

  render (){
    return (
      <div className='container'>
        <div className="step">step:{this.state.step}</div>
        <div className="top">
          <div className="name">Column1</div>
          <div className="name">Column2</div>
          <div className="name">Column3</div>
        </div>
        <div className='Hanoi'>
          <Column list={this.state.Column1} clickFn={this.clickFn(0)} />
          <Column list={this.state.Column2} clickFn={this.clickFn(1)} />
          <Column list={this.state.Column3} clickFn={this.clickFn(2)} />
        </div>
        <button onClick={this.reset.bind(this)}>reset</button>
        <button onClick={this.start.bind(this)}>start</button>
      </div>
    );
  } 
}