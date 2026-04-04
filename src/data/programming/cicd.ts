import { CodeSnippet } from './types';

// GitHub Actions/CI Snippets
export const CICD_SNIPPETS: CodeSnippet[] = [
  {
    id: 'gha-basic',
    language: 'yaml',
    title: 'GitHub Actions Basic',
    code: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build`,
    difficulty: 'beginner',
  },
  {
    id: 'gha-matrix',
    language: 'yaml',
    title: 'Matrix Strategy',
    code: `name: Test Matrix

on: [push, pull_request]

jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
        exclude:
          - os: windows-latest
            node: 18

    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node }}
    - run: npm ci
    - run: npm test`,
    difficulty: 'intermediate',
  },
  {
    id: 'gha-deploy',
    language: 'yaml',
    title: 'Deploy Workflow',
    code: `name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
    - uses: actions/checkout@v4

    - name: Build Docker image
      run: docker build -t myapp:\${{ github.sha }} .

    - name: Login to Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}

    - name: Push image
      run: |
        docker tag myapp:\${{ github.sha }} ghcr.io/\${{ github.repository }}:\${{ github.sha }}
        docker push ghcr.io/\${{ github.repository }}:\${{ github.sha }}

    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/myapp myapp=ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
    difficulty: 'advanced',
  },
];
