Title: Specify the Supervisor and Nginx runtime contract
Type: grilling
Status: open
Blocked by: 02, 03

## Question

How should Forge run and expose the `adapter-node` server in staging and production?

Specify the Supervisor command, working directory, user, process count, signals, shutdown/start timeouts and logs; the loopback port and origin/proxy-header policy; Nginx proxy behavior, compression and static asset handling; healthcheck behavior; and the acceptable short restart window. Do not introduce HTML caching in the initial contract.
