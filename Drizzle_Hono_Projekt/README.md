# Features:

- GET, POST, PATCH, DELETE (auch PUT dabei, aber funktioniert nicht mit REST
  Extension in VisualStudio Code)
- Integration mit SQL Lite (nicht nodeSQL Lite )
- leider kein Browser für meine API Request(wird nach Request implementiert)

### Anmerkung:

Der Drizzle-Kit Migration legt den Schema nicht an der Datenbank, sondern fügt
dem eine Migrationtable an. Verwende dabei Drizzle Push und ignoriere derweil
den runtime Code für Migrieren des Schemas per Drizzle-Kit. Die Datenbank darf
dabei nicht mit Deno.clear gelöscht werden, sondern alle Daten sollen von dem
entfernt werden und das Autoincrement wird zurückgesetzt.
