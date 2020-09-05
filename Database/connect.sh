#!/bin/bash
docker run -it --rm --network database_default  mongo mongo --host database_database_1 test