#!/usr/bin/sh

mongo <<EOF
use admin
db.createUser(
    {
        user: "root",
        pwd: "Welcome123",
        roles: [
          { role: "userAdminAnyDatabase", db:"admin" },
          { role: "readWriteAnyDatabase", db:"admin" },
          { role: "dbAdminAnyDatabase", db:"admin" },
          { role: "clusterAdmin", db:"admin" }
        ]
    }
)
EOF
