class LeaderBoardEntry{
    name;
    time;
    timeStampCreated;

    constructor(name, score, timeStampCreated) {
        this.name = name;
        this.time = score;
        this.timeStampCreated = timeStampCreated;
    }

    getTimeFromMilliSecondsToString(){
        return Math.floor(this.time/1000/60) + ":" + ("0" + Math.floor(this.time/1000)%60).slice(-2) + ":" + ("0" + Math.floor(this.time/10)%100).slice(-2);
    }
}