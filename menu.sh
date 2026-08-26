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
  echo "  1) 🐳 Construir imagen Docker"
  echo ""
  echo "  2) 👀 Ejecutar tests en modo watch"
  echo ""
  echo -e "${RED} 0) ❌ Salir${NC}"
  echo ""
}

# Docker functions
build_docker() {
  echo -e "${BLUE}🐳 Construyendo imagen Docker...${NC}"
  docker-compose build
  echo -e "${GREEN}✅ Imagen construida exitosamente${NC}"
}

run_tests_watch() {
  echo -e "${BLUE}👀 Ejecutando tests en modo watch...${NC}"
  echo -e "${YELLOW}(Presiona Ctrl+C para salir)${NC}"
  npm run test:watch
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
