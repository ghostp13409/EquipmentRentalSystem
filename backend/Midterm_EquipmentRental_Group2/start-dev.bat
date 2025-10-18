@echo off
REM Start backend API
start "" dotnet run --project Midterm_EquipmentRental_Group2\Midterm_EquipmentRental_Group2.csproj

REM Start React client
cd ..\..\..\client
start "" npm start
cd ..\backend\Midterm_EquipmentRental_Group2