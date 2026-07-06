package com.lanchonete.dianaburgers_web.util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Gera e verifica hashes de senha com PBKDF2WithHmacSHA256.
 * Formato armazenado: "iteracoes:saltBase64:hashBase64".
 * Não depende de bibliotecas externas (usa apenas javax.crypto do próprio JDK).
 */
public final class PasswordUtil {

    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH_BITS = 256;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";

    private PasswordUtil() {
    }

    public static String hash(String senhaPlana) {
        try {
            byte[] salt = new byte[16];
            new SecureRandom().nextBytes(salt);
            byte[] hash = pbkdf2(senhaPlana.toCharArray(), salt, ITERATIONS, KEY_LENGTH_BITS);
            return ITERATIONS + ":" + Base64.getEncoder().encodeToString(salt) + ":"
                    + Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash da senha.", e);
        }
    }

    public static boolean matches(String senhaPlana, String senhaArmazenada) {
        if (senhaPlana == null || senhaArmazenada == null) return false;
        try {
            String[] partes = senhaArmazenada.split(":");
            if (partes.length != 3) return false;

            int iteracoes = Integer.parseInt(partes[0]);
            byte[] salt = Base64.getDecoder().decode(partes[1]);
            byte[] hashEsperado = Base64.getDecoder().decode(partes[2]);

            byte[] hashCalculado = pbkdf2(senhaPlana.toCharArray(), salt, iteracoes, hashEsperado.length * 8);
            if (hashCalculado.length != hashEsperado.length) return false;

            int diferenca = 0;
            for (int i = 0; i < hashCalculado.length; i++) {
                diferenca |= hashCalculado[i] ^ hashEsperado[i];
            }
            return diferenca == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private static byte[] pbkdf2(char[] senha, byte[] salt, int iteracoes, int keyLengthBits) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(senha, salt, iteracoes, keyLengthBits);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }
}
