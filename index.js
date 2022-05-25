function App(){
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [breakOn, setBreakOn] = React.useState(false);
    
    const playAudio = () =>{
        let noOfRepetitions = 3;
        let myAudio = document.getElementById("beep");
        myAudio.addEventListener('ended', function() {
            noOfRepetitions = noOfRepetitions-1;
            if (noOfRepetitions > 0) {
                this.currentTime = 0;
                this.play()};
    });
        myAudio.play();
    }

    const incrementBreak = () => {
        if(breakTime == 60 * 60 || timerOn){
            return;
        }
        setBreakTime(breakTime + 60);
    }
    const decrementBreak = () => {
        if(breakTime == 60 || timerOn){
            return;
        }
        setBreakTime(breakTime - 60);
    }
    const incrementSession = () => {
        if(sessionTime == 60 * 60 || timerOn){
            return;
        }
        setSessionTime(sessionTime + 60);
        setDisplayTime(sessionTime + 60);            
    }

    const decrementSession = () => {
        if(sessionTime == 60 || timerOn){
            return;
        }
        setSessionTime(sessionTime - 60);
        setDisplayTime(sessionTime - 60);      
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return (
            (minutes < 10 ? "0" + minutes : minutes) + " : " + (seconds < 10 ? "0" + seconds : seconds)
        );
    }

    const resetTime = () => {
        if(breakTime == 5 && sessionTime == 25 && displayTime == 25){
            return;
        }
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
        setDisplayTime(25 * 60);
        setTimerOn(false);
        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
    }

    React.useEffect(
        () => {
            let interval = null;
            let onBreakVariable = breakOn;
            if(timerOn){
                interval = setInterval(()=>setDisplayTime((prev)=>{
                    if(prev == 0 && !onBreakVariable){
                        playAudio();
                        setBreakOn(true);
                        onBreakVariable = true; 
                        return breakTime;
                    }
                    else if(prev == 0 && onBreakVariable){
                        playAudio();
                        setBreakOn(false);
                        onBreakVariable = false;
                        return sessionTime;
                    }
                    return prev - 1; 
                }), 1000);
            }            
            else{
                clearInterval(interval);
            }
            return () => clearInterval(interval);
        }, [timerOn]
    );
   
    return(
        <div className="container">
            <div className="timer__wrapper">
                <h1 className="font-weight-bold text-uppercase">Pomodoro Timer</h1>
                <div className="break__session__length">
                    <BreakElement breakTime={breakTime / 60} incrementBreak={incrementBreak} decrementBreak={decrementBreak}/>
                    <SessionElement sessionTime={sessionTime / 60} incrementSession={incrementSession} decrementSession={decrementSession}/>
                </div>
                <div className="timer__container">
                    <h2>{!breakOn ? "SESSION" : "BREAK"}</h2>
                    <div className="timer">{formatTime(displayTime)}</div>
                    <div>
                        {!timerOn ? <img onClick={() => setTimerOn(true)} className="pause__reset"
                        src="https://img.icons8.com/ios-filled/50/000000/play-button-circled--v1.png"/>
                        : <img onClick={() => setTimerOn(false)} className="pause__reset"
                        src="https://img.icons8.com/ios-filled/50/000000/circled-pause.png"/>}
                        <img onClick={resetTime} className="pause__reset"
                        src="https://img.icons8.com/external-kmg-design-outline-color-kmg-design/32/000000/
                            external-refresh-arrow-kmg-design-outline-color-kmg-design-2.png"/>
                        <audio id="beep" src="beep-01a.mp3"></audio> 
                    </div> 
                </div> 
            </div>         
        </div>
    );
}

function BreakElement(props){
    return(
        <div className="break__element">
            <h2 className="break__title">Break Length</h2>
            <div className="change__length">
                <img className="icons"
                     onClick={props.incrementBreak}
                     src="https://img.icons8.com/fluency/48/000000/circled-chevron-up.png"/>
                <h2 className="labels">{props.breakTime}</h2>
                <img className="icons" onClick={props.decrementBreak} 
                    src="https://img.icons8.com/color/48/000000/circled-chevron-down--v1.png"/>
            </div>
        </div>
    );   
}

function SessionElement(props){
    return(
        <div className="session__element">
            <h2 className="session__title">Session Length</h2>
            <div className="change__length">
                <img className="icons" onClick={props.incrementSession}
                    src="https://img.icons8.com/fluency/48/000000/circled-chevron-up.png"/>
                <h2 className="labels">{props.sessionTime}</h2>
                <img className="icons" onClick={props.decrementSession}
                    src="https://img.icons8.com/color/48/000000/circled-chevron-down--v1.png"/>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"));
