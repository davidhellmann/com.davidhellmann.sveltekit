Title: Design activation, healthcheck, and rollback
Type: grilling
Status: open
Blocked by: 02, 03

## Question

What is the complete failure-safe lifecycle for building, activating, verifying, restarting, retaining, and rolling back a Node release within the existing custom deploy script?

Specify ordering and failure behavior for dependency installation, build, release creation, shared-file linkage, symlink activation, Supervisor restart, readiness/health checking, automatic or manual rollback, cleanup of old releases, and deploys that exceed Forge's time limit. The answer should identify the last known-good release throughout the sequence.
