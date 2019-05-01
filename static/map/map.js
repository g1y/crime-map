export default class Map {
    constructor() {
        this.map = this.initMap();
    }

    initMap() {
        throw "No init function; override map initialization in subclass";
    }
}