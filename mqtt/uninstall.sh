sudo systemctl stop pollumq.service
sudo systemctl disable pollumq.service
sudo rm /etc/systemd/system/pollumq.service
sudo systemctl daemon-reload