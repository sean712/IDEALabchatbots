/*
  # Wipe existing conversation data

  This migration removes all existing conversation data from the database to start with a clean slate.
  
  1. Data Cleanup
     - Remove all records from the `conversations` table
     - This gives us a fresh start for production data collection
  
  2. Notes
     - This is a one-time cleanup operation
     - All previous test and development conversation data will be permanently deleted
     - Future conversations will be saved normally (unless using ?test=true URL parameter)
*/

-- Remove all existing conversation records
DELETE FROM conversations;