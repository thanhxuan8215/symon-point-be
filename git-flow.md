# Git flow handling

## Branches

**develop**: for development

**staging**: for testing

**main**: for deploy to production

## Handle new feature

Checkout to develop -> pull code latest

Checkout to new branch with name: feature/[name] -> coding feature

Commit, push to remote -> create MR to develop

## Handle bugs

Checkout to source branch -> pull code latest

Checkout to new branch with name: fix-bugs/[name] -> fix bugs

Commit, push to remote -> create MR to source branch

## Handle conflicts

Checkout to target branch -> pull code latest

Checkout to source branch: merge or rebase target branch -> handle conflicts

Commit, push to remote -> create MR to target branch
