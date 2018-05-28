import React, { Component } from 'react';
import "./TimeBar.css";
import Stamp from './Stamp';

export default class TimeBar extends Component{
    constructor(props){
        super(props);
        this.bottomLine = React.createRef();
        this.state = {
            ticks: null,
            stamps: null,
            width: "99%",
        };
    }
    componentDidMount(){
        this.format();
        window.addEventListener("resize", this.format.bind(this));
    }
    format = () => {
        this.createTicks(null,() => {
            this.createStamps();
        });
    }
    createTicks = (e,callback) => {
        this.setState({width: "99%"},() => {
            let { resolution } = this.props;
            let size = this.bottomLine.current.offsetWidth;
            let ticks = new Array(Math.floor(size/resolution)+1);
            for(let i=0;i<ticks.length;i++){
                ticks[i] = (
                    <div key={i}className="tb-sline"style={{left: i*resolution}}></div>
                );
            }
            let correctWidth = resolution*(ticks.length-1);
            this.setState({ticks,width: correctWidth},callback);
        });
    }
    createStamps = (callback) => {
        if(this.state.ticks){
            let stamps = new Array(this.state.ticks.length);
            this.state.ticks.forEach((tick,ti) => {
                let time = this.props.reference+tick.props.style.left/this.props.resolution;
                stamps[ti] = (<Stamp text={time} key={this.state.ticks.length+ti} left={time*this.props.resolution}/>);
            });
            this.setState({stamps},callback);
        }else{
            if(callback){
                callback(new Error("No ticks found"));
            }
        }
    }
    _getDateString = (time) => {
        let d = new Date();
        d.setTime(time);
        switch(this.props.units){
            case 'hours':
                return d.toLocaleTimeString().split(":")[0];
            default:
                return d.toLocaleDateString();
        }

    }
    render(){
        return (
            <tr>
                <td>PR</td>
                <td className="tb-rule-container">
                    <div className="tb-rule">
                        <div ref={this.bottomLine}
                            style={{width:this.state.width}}
                            className="tb-bottomline"></div>
                        {
                            this.state.ticks||null
                        }
                        {
                            this.state.stamps||null
                        }
                    </div>
                </td>
            </tr>
        );
    }
}