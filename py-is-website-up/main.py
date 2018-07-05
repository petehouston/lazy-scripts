#!/usr/bin/env python

import socket, sys

def get_sites_from_argv(input):
    return input[:]

def get_sites_from_file(file_input):
    try:
        fd = open(file_input, 'r')
    except IOError:
        print('[ERROR] Fail to open input file')
        quit()
    
    sites = []
    
    for s in fd.readlines():
        sites.append(s.strip())
    
    return sites

def is_site_alive(site):
    try:
        host = socket.gethostbyname(site)
        sock = socket.create_connection((host, 80), 5)
        return True
    except:
        return False

def main():
    file_input = 'sites.txt'
    argv_input = sys.argv[1:]
    sites = []

    if(len(argv_input) > 0):
        sites = get_sites_from_argv(argv_input)
    else:
        sites = get_sites_from_file(file_input)

    for site in sites:
        if is_site_alive(site):
            print("Site: %s is ALIVE" % site)
        else:
            print("Site: %s is DOWN" % site)

if __name__ == '__main__':
    main()
        


