@echo off
start cmd /k "cd backend && dotnet restore"
start cmd /k "cd client && npm install"
