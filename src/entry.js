import { spawn } from 'child_process';

console.log("Enter the cab's IP address: ");

child.stdout.on('data', (data) => {
    process.stdout.write(data);
});
child.stderr.on('data', (data) => {
    process.stderr.write(data);
});
