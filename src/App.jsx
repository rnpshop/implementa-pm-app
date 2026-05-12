-- Tabela de onboarding do cliente
create table onboarding (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  -- Dados da empresa
  company_name text,
  cnpj text,
  email text,
  phone text,
  address text,
  -- Plataforma
  platform text,
  platform_login text,
  platform_password text,
  -- Acessos
  registrobr_login text,
  registrobr_password text,
  erp text,
  erp_login text,
  erp_password text,
  gateway_envio text,
  gateway_pagamento text,
  certificado_senha text,
  -- Atendimento
  atendimento_info text,
  quem_somos text,
  -- Marca
  cores text,
  -- Categorias e redes sociais
  categorias text,
  redes_sociais text,
  referencias_sites text,
  -- Status
  status text default 'pending',
  created_at timestamptz default now()
);

-- Tabela de produtos
create table products (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  code text,
  ean text,
  name text not null,
  description text,
  category text,
  price decimal,
  stock int default 0,
  weight decimal,
  height decimal,
  width decimal,
  length decimal,
  images text[],
  status text default 'pending',
  created_at timestamptz default now()
);

-- Tabela de checklist técnico
create table tech_checklist (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  task text not null,
  category text,
  done boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- Atualizar tabela de perfis com role
alter table profiles add column if not exists project_id uuid references projects(id);

-- Desabilitar RLS
alter table onboarding disable row level security;
alter table products disable row level security;
alter table tech_checklist disable row level security;

-- Inserir checklist técnico padrão para novos projetos
create or replace function create_tech_checklist(p_project_id uuid)
returns void as $$
begin
  insert into tech_checklist (project_id, task, category) values
  (p_project_id, 'Vincular domínio com a plataforma', 'Configuração Inicial'),
  (p_project_id, 'Adicionar dados da empresa na plataforma', 'Configuração Inicial'),
  (p_project_id, 'Configurar Meta Title e Meta Description', 'SEO'),
  (p_project_id, 'Criar categorias e subcategorias com SEO', 'SEO'),
  (p_project_id, 'Criar páginas de políticas', 'Conteúdo'),
  (p_project_id, 'Configurar menu topo', 'Layout'),
  (p_project_id, 'Configurar menu rodapé', 'Layout'),
  (p_project_id, 'Instalar e configurar layout', 'Layout'),
  (p_project_id, 'Adicionar cores da marca', 'Layout'),
  (p_project_id, 'Adicionar dados de atendimento no layout', 'Layout'),
  (p_project_id, 'Estruturar layout conforme demonstração', 'Layout'),
  (p_project_id, 'Configurar meios de pagamento', 'Pagamento'),
  (p_project_id, 'Configurar regras de desconto', 'Pagamento'),
  (p_project_id, 'Configurar gateway de envio', 'Envio'),
  (p_project_id, 'Configurar regras de envio', 'Envio'),
  (p_project_id, 'Realizar testes gerais', 'Testes'),
  (p_project_id, 'Integrar ERP com plataforma', 'Integração'),
  (p_project_id, 'Configurar dados da empresa no ERP', 'Integração'),
  (p_project_id, 'Configurar certificado e emissão de NF', 'Integração'),
  (p_project_id, 'Realizar integração com marketplaces', 'Marketplace'),
  (p_project_id, 'Configurar logística de marketplaces', 'Marketplace'),
  (p_project_id, 'Realizar mapeamento das integrações', 'Marketplace'),
  (p_project_id, 'Criar briefing com copy para designer', 'Entrega');
end;
$$ language plpgsql;
