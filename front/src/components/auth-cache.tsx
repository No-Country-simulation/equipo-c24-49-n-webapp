type CachedAuth = {
    isAuthenticated: boolean;
    user: any;
    expiry: number;
  };
  
  export const AuthCache = {
    // Guardar estado de autenticación en sessionStorage
    setAuthState(isAuthenticated: boolean, user: any | null) {
      try {
        const authState: CachedAuth = {
          isAuthenticated,
          user,
          expiry: Date.now() + 1000 * 60 * 60 // 1 hora de caducidad
        };
        sessionStorage.setItem('authState', JSON.stringify(authState));
      } catch (error) {
        console.error("Error guardando estado de autenticación:", error);
      }
    },
  
    // Obtener estado de autenticación de sessionStorage
    getAuthState(): CachedAuth | null {
      try {
        const data = sessionStorage.getItem('authState');
        if (!data) return null;
        
        const authState: CachedAuth = JSON.parse(data);
        
        // Verificar si ha caducado
        if (authState.expiry < Date.now()) {
          sessionStorage.removeItem('authState');
          return null;
        }
        
        return authState;
      } catch (error) {
        console.error("Error recuperando estado de autenticación:", error);
        return null;
      }
    },
  
    // Eliminar estado de autenticación (logout)
    clearAuthState() {
      try {
        sessionStorage.removeItem('authState');
      } catch (error) {
        console.error("Error eliminando estado de autenticación:", error);
      }
    }
  };
  