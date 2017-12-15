import * as Rx from "rxjs/Rx"
import * as fs from "fs"

var exists = Rx.Observable.bindCallback(fs.exists)
exists("yarn.lock").subscribe(exists => console.log("Does file exist?", exists))
