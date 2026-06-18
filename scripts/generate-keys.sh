#!/bin/bash
# =============================================================================
# Script para gerar pares de chaves ES256 (ECDSA P-256)
# Usado para assinatura assimétrica de JWT (Access Token + Refresh Token)
# =============================================================================

set -euo pipefail

KEYS_DIR="$(dirname "$0")/../keys"

mkdir -p "$KEYS_DIR"

echo "🔐 Gerando par de chaves ES256 para ACCESS TOKEN..."
openssl ecparam -genkey -name prime256v1 -noout -out "$KEYS_DIR/access_private.pem"
openssl ec -in "$KEYS_DIR/access_private.pem" -pubout -out "$KEYS_DIR/access_public.pem" 2>/dev/null
chmod 600 "$KEYS_DIR/access_private.pem"

echo "🔐 Gerando par de chaves ES256 para REFRESH TOKEN..."
openssl ecparam -genkey -name prime256v1 -noout -out "$KEYS_DIR/refresh_private.pem"
openssl ec -in "$KEYS_DIR/refresh_private.pem" -pubout -out "$KEYS_DIR/refresh_public.pem" 2>/dev/null
chmod 600 "$KEYS_DIR/refresh_private.pem"

echo ""
echo "✅ Chaves geradas com sucesso em: $KEYS_DIR"
echo ""
echo "  access_private.pem  — Assinar access tokens (MANTER SECRETO)"
echo "  access_public.pem   — Verificar access tokens"
echo "  refresh_private.pem — Assinar refresh tokens (MANTER SECRETO)"
echo "  refresh_public.pem  — Verificar refresh tokens"
