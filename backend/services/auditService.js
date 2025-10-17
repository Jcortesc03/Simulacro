// backend/services/auditService.js

import db from '../database/config.js';

/**
 * Registra una acción administrativa en la base de datos.
 * @param {object} adminUser - El objeto 'user' del administrador (de req.user).
 * @param {string} actionType - El tipo de acción realizada (ej. 'DELETE_USER').
 * @param {string} details - Una descripción detallada de la acción.
 * @param {string} ipAddress - La dirección IP del cliente.
 */
export const logAction = async (adminUser, actionType, details, ipAddress) => {
  try {
    const adminUserId = adminUser?.user_id || adminUser?.id;

    if (!adminUserId) {
      console.error('AUDIT_ERROR: No se pudo registrar la acción por falta de adminUserId.');
      return;
    }

    await db.query(
      `INSERT INTO audit_logs (user_id, action_type, details, ip_address) VALUES ($1, $2, $3, $4)`,
      [adminUserId, actionType, details, ipAddress]
    );

    console.log(`[AUDIT] Acción registrada: ${adminUser.email} -> ${actionType}`);

  } catch (error) {
    // Es importante que un fallo en la auditoría NO detenga la acción principal.
    // Solo lo registramos en la consola.
    console.error('AUDIT_FAILURE: No se pudo escribir en el registro de auditoría.', error);
  }
};