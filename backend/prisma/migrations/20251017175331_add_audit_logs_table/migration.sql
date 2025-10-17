-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "log_id" BIGSERIAL NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "details" TEXT,
    "ip_address" VARCHAR(45),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "public"."audit_logs"("user_id");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
