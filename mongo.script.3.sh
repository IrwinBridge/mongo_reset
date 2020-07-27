#!/usr/bin/sh

mongo --tls --tlsAllowInvalidCertificates <<EOF
use admin
db.auth("root","Welcome123")
rs.initiate()
EOF