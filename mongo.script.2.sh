#!/usr/bin/sh

mongo <<EOF
use admin
db.auth("root","Welcome123")
use lms
db.createUser(
  {
    user: "napi",
    pwd: "Welcome123",
    roles: [
      { role: "dbOwner", db:"lms" }
    ]
  }
)
use lms_audit
db.createUser(
  {
    user: "napi",
    pwd: "Welcome123",
    roles: [
      { role: "dbOwner", db:"lms_audit" }
    ]
  }
)
use lms_auth
db.createUser(
  {
    user: "napi",
    pwd: "Welcome123",
    roles: [
      { role: "dbOwner", db:"lms_auth" }
    ]
  }
)
EOF