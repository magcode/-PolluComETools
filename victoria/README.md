# PolluComE VictoriaMetrics
This allows to send PolluComE data to VictoriaMetrics.

# Installing
This guide is for running on a Raspberry Pi.

Make sure you have gcc and NodeJS installed.
The install script requires password less sudo permission. Do the steps in `install.sh` manually if you don't have this.

```
cd ~
git clone git@github.com:magcode/PolluComETools.git
PolluComETools/victoria/install.sh
```

# Configuration
Before you start it the first time configure `victoria/config/default.json`

```
{
  "victoriametrics": {
    "host": "my.victoria.host",
	"port": "8428"
  },
  "usbport": "/dev/ttyUSB1",
  "schedule": 15,
  "exec": "~/PolluComETools/victoria/pollucom",
  "mappings" : [
	{"energy":"heatingEnergy"},
	{"power":"heatingPower"},
	{"tempIn":"heatingTempIn"},
	{"tempOut":"heatingTempOut"},
	{"flow":"heatingFlow"}
  ]
}
```
The `mappings` section allows you to map the input value to a metric name of your choice.

# Starting
```
sudo service polluvic start
```

**Press the button** on your PolluCom E unit. After a short press, the unit will respond to IR signals for one hour.
Make sure you configure the `schedule` below 60 minutes.

# Uninstall

```
cd ~
PolluComETools/victoria/uninstall.sh
```
