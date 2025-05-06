# Psy

A psychologist in your pocket.

## Installation

Add these aliases in your PATH:

```bash
alias psy-pull="docker pull atrtdeee/psy:latest"
alias psy-init="docker run -d --name psy-container -p 3000:3000 atrtdeee/psy:latest"
alias psy-start="docker start psy-container"
alias psy-stop="docker stop psy-container"
```

Run the following commands to get started:

```bash
docker login
psy-pull
psy-init
psy-start
```
