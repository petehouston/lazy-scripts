#!/usr/bin/python

import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    fd = open('config.txt', 'r')
except IOError:
    print('[ERROR] Fail to open config file')
    quit()

server, username, password = fd.readline().strip().split(':')
localfile, remotefile = fd.readline().strip().split(':')

print('localfile: ', localfile)
print('remotefile: ', remotefile)


prevtime = time.time()
currtime = time.time()

try:
    ssh.connect(server, username=username, password=password)    
    # stdin, stdout, stderr = ssh.exec_command('rm -rf /home/user/config.txt')
    # for lin in stdout.readlines():
        # print(lin.strip())
except paramiko.AuthenticationException:
    print('[ERROR] Authentication failure')
    quit()
except:
    print('[ERROR] Unknown error')
    quit()



def reportUploadProgress(bTrans, bTotal):
    global currtime
    global prevtime
    currtime = time.time()
    if currtime - prevtime < 1:
        return
    prevtime = currtime
    percent = int(bTrans / bTotal * 100)
    if bTrans < bTotal:
        print("[UPLOAD] Progress: %d%%" % (percent))
    else:
        print('[UPLOAD] Completed!')

sftp = ssh.open_sftp()
sftp.put(localfile, remotefile, callback=reportUploadProgress)
ssh.close()