@echo off
echo =======================================================
echo          Album Fotografico - Fabio e Tiziana
echo =======================================================
echo.
echo Preparazione delle nuove immagini e avvio del server...
echo.
echo ATTENZIONE: Lascia questa finestra aperta mentre guardi 
echo l'album. Per spegnere il sito, chiudi questa finestra.
echo.

:: Apre il browser predefinito all'indirizzo locale
start http://localhost:5173/

:: Avvia il server (che prima lancia in automatico lo script di scansione foto)
call npm run dev

pause
