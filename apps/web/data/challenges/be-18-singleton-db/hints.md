1. How would you store the database connection so that subsequent calls to getInstance() return the same one?
2. What happens if two concurrent calls to getInstance() both check "is connected?" before either has finished connecting? How do you prevent two connections from being created?
3. Should you store the resolved connection value, or the Promise itself? Which one prevents the race condition?
