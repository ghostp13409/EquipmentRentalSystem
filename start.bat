@echo off
start cmd /k "cd backend && dotnet run --launch-profile https"
start cmd /k "cd client && npm run dev"
