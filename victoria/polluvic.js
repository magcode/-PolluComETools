const { Retrier } = require('@jsier/retrier');
const { exec } = require("child_process");
var http = require('http');
const cron = require('node-cron');
const config = require('config');

const vicHost = config.get('victoriametrics.host');
const vicPort = config.get('victoriametrics.port');

const binary = config.get('exec');
const usbport = config.get('usbport');

// this maps value names to metrics name in VictoriaMetrics
const mappings = config.get('mappings');

const everyXMinutes = config.get('schedule');
const retryAfter = 10000;
const retryLimit = 4;

console.log("PolluComE VictoriaMetrics interface");
console.log("Using victoria server: " + vicHost +  ":" + vicPort);
console.log("Using binary: " + binary);
console.log("Sending data every: " + everyXMinutes + " minute");
console.log();

const options = { limit: retryLimit, delay: retryAfter };
const retrier = new Retrier(options);

var timer = "*/" + everyXMinutes + ' * * * *';
cron.schedule(timer, function () {
    retrier.resolve(attempt => new Promise(
        function (resolve, reject) {
			exec(binary + " -d " + usbport, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    reject("Error")
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject("Error")
                }
                var lines = stdout.toString().split('\n');

                if (lines.includes("No data received!")) {     
                    console.log("No data received!")
                    reject("No data")
                }
                
                var data = {};
                lines.forEach(function (line) {
                    if (line != '' && !line.includes("No data") && !line.includes("volume") && !line.includes("tempDiff"))  {
                        var string = line.split(' ');
                        data[string[0]] = string[1];
                    }
                });
				resolve(data)
            });
        })
    )
    .then(
		result => {
                Object.keys(result).forEach(function (key, index) {
					mappings.forEach(function(element){
						if (element.hasOwnProperty(key)) {
							const data = "home " + element[key] + "=" + result[key]
							//console.log("Data: '" + data + "'")
							const httpOptions = {
								hostname: vicHost,
								port: vicPort,
								path: '/write',
								method: 'POST',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Content-Length': data.length,
									'Access-Control-Allow-Origin': '*'
								}					
							}
							
							const req = http.request(httpOptions, (res) => {
									if (res.statusCode!=204) {
										console.log(`ERROR, got statusCode from victoria: ${res.statusCode}`)	
									}
									
								})
							req.write(data)
							req.end()
							req.on('error', (error) => {
									console.error("ERROR: " + error)
								})
						}				
					});
                });
		},
        error => console.log(error)
    );
});