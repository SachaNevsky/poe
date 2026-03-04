#!/usr/bin/env node

import { execSync } from 'child_process';

const message = process.argv[2];

if (!message) {
    console.error('Error: Commit message required');
    console.error('Usage: npm run push "your commit message"');
    process.exit(1);
}

try {
    execSync('npm run deploy', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });

    console.log('Successfully deployed and pushed!');
} catch (error: unknown) {
    if (error instanceof Error) {
        console.error('Error occurred:', error.message);
    } else {
        console.error('Error occurred:', error);
    }
    process.exit(1);
}