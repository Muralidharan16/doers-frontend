#!/usr/bin/env python3
"""Minimal authenticated STARTTLS SMTP sink for CERT-B.

The application still uses its production SMTP adapter. This process only captures
messages at the infrastructure boundary so the browser test can follow the real
verification link.
"""

from __future__ import annotations

import argparse
import json
import ssl
import time
from email import policy
from email.parser import BytesParser
from pathlib import Path

from aiosmtpd.controller import Controller
from aiosmtpd.smtp import AuthResult


class CaptureHandler:
    def __init__(self, output: Path) -> None:
        self.output = output

    async def handle_DATA(self, _server, _session, envelope):
        message = BytesParser(policy=policy.default).parsebytes(envelope.original_content)
        body = message.get_body(preferencelist=("html", "plain"))
        record = {
            "from": envelope.mail_from,
            "to": list(envelope.rcpt_tos),
            "subject": str(message.get("subject", "")),
            "body": body.get_content() if body is not None else "",
        }
        with self.output.open("a", encoding="utf-8") as stream:
            stream.write(json.dumps(record) + "\n")
        return "250 Message accepted for delivery"


def authenticator(_server, _session, _envelope, mechanism, auth_data):
    if mechanism not in {"PLAIN", "LOGIN"}:
        return AuthResult(success=False, handled=False)
    return AuthResult(success=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--cert", required=True)
    parser.add_argument("--key", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=1025)
    args = parser.parse_args()

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("", encoding="utf-8")

    tls = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    tls.load_cert_chain(args.cert, args.key)
    controller = Controller(
        CaptureHandler(output),
        hostname=args.host,
        port=args.port,
        tls_context=tls,
        require_starttls=True,
        auth_required=True,
        authenticator=authenticator,
    )
    controller.start()
    try:
        while True:
            time.sleep(60)
    finally:
        controller.stop()


if __name__ == "__main__":
    main()
