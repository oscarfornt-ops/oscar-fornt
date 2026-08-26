set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                  🎫 WUOLAH - MENU PRINCIPAL                ║"
  echo "║            Event Attendance Management System              ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
}

print_menu() {
  echo ""
  echo -e "${YELLOW}Selecciona una opción:${NC}"
  echo ""
  echo "  1) 🐳 Construir imágenes Docker"
  echo ""
  echo "  2) 🚀 Levantar backend, MongoDB y front"
  echo ""
  echo "  3) 🌐 Levantar solo el front"
  echo ""
  echo "  4) 🌱 Cargar datos de ejemplo en MongoDB"
  echo ""
  echo "  5) 👀 Ejecutar tests en modo watch"
  echo ""
  echo -e "${RED} 0) ❌ Salir${NC}"
  echo ""
}

# Docker functions
build_docker() {
  echo -e "${BLUE}🐳 Construyendo imagen Docker...${NC}"
  docker compose build
  echo -e "${GREEN}✅ Imágenes construidas exitosamente${NC}"
}

start_frontend() {
  if [[ -f frontend/.frontend.pid ]] && kill -0 "$(cat frontend/.frontend.pid)" 2>/dev/null; then
    echo -e "${YELLOW}🌐 El front ya está ejecutándose en http://localhost:5173${NC}"
    return
  fi

  if [[ ! -d frontend/node_modules ]]; then
    echo -e "${BLUE}📦 Instalando dependencias del front...${NC}"
    npm --prefix frontend install
  fi

  nohup npm --prefix frontend run dev > frontend.log 2>&1 &
  echo $! > frontend/.frontend.pid
  echo -e "${GREEN}✅ Front ejecutándose en segundo plano: http://localhost:5173${NC}"
}

start_docker() {
  echo -e "${BLUE}🚀 Levantando backend y MongoDB en segundo plano...${NC}"
  docker compose up --build -d
  start_frontend
  echo -e "${GREEN}✅ API: http://localhost:3000${NC}"
  echo -e "${GREEN}✅ Front: http://localhost:5173${NC}"
}

run_tests_watch() {
  echo -e "${BLUE}👀 Ejecutando tests en modo watch...${NC}"
  echo -e "${YELLOW}(Presiona Ctrl+C para salir)${NC}"
  npm run test:watch
}

seed_database() {
  echo -e "${BLUE}🌱 Cargando eventos, usuarios y asistencias de ejemplo...${NC}"
  npm run seed
  echo -e "${GREEN}✅ Datos de ejemplo cargados${NC}"
}

# Main loop
main() {
  print_header

  while true; do
    print_menu
    read -p ">: " choice
    echo ""

    case $choice in
      1)
        build_docker
        ;;
      2)
        start_docker
        ;;
      3)
        start_frontend
        ;;
      4)
        seed_database
        ;;
      5)
        run_tests_watch
        ;;
      0)
        echo -e "${YELLOW}👋 ¡Hasta luego!${NC}"
        exit 0
        ;;
      *)
        echo -e "${RED}❌ Opción no válida...${NC}"
        ;;
    esac

    echo ""
    read -p "Presiona Enter para continuar..."
  done
}

# Run main function
main
