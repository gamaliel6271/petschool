<template>
  <div class="app-shell">
    <!-- ===== Topbar verde ===== -->
    <header class="topbar">
      <RouterLink to="/tutores" class="brand">
        <i class="bi bi-paw"></i> PetSchool
      </RouterLink>

      <div class="topbar-actions">
        <RouterLink to="/pets" class="topbar-link">Pets</RouterLink>
        <RouterLink to="/tutores" class="topbar-btn">
          <i class="bi bi-plus-lg"></i> Novo pet
        </RouterLink>
      </div>
    </header>

    <div class="shell-body">
      <!-- ===== Sidebar ===== -->
      <aside class="sidebar">
        <RouterLink to="/pets" class="sidebar-link">
          <i class="bi bi-paw"></i> Pets
        </RouterLink>
        <RouterLink to="/tutores" class="sidebar-link">
          <i class="bi bi-plus-lg"></i> Novo pet
        </RouterLink>
        <RouterLink to="/tutores" class="sidebar-link">
          <i class="bi bi-list-ul"></i> Tutores
        </RouterLink>
        <RouterLink to="/tutores/novo" class="sidebar-link sidebar-link-btn">
          <i class="bi bi-list-ul"></i> Novo tutor
        </RouterLink>
      </aside>

      <!-- ===== Conteúdo ===== -->
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
