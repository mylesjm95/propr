import { t } from "i18next";

import { PageHeader } from "@/components/layout";
import { AgentForm } from "@/components/agents";
import { AdminLayout } from "@/components/layouts";
import { routes } from "@/config/routes";

<AdminLayout>
  <PageHeader
    title={t("pages.agents.edit.title")}
    breadcrumbs={[
      { name: t("pages.agents.title"), href: routes.agents.index() },
      { name: t("common.edit"), href: "#" },
    ]}
  />
  <AgentForm />
</AdminLayout>;