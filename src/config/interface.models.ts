// TEC_ENDPOINT.ts
export interface TEC_ENDPOINTDTO {
    TEC_EndpointName: string;
    TEC_EndpointP256dh: string;
    TEC_EndpointEndpoint: string;
    TEC_EndpointAuth: string;
    Eliminar?: boolean
  }
  
  // TEC_PARAMETRO.ts
  export interface TEC_PARAMETRODTO {
    TEC_ParametroCodigoCliente: number;
    TEC_ParametroNomeCliente: string;
    Eliminar?: boolean
  }
  
  // TEC_BASEAPLICACAO.ts
  export interface TEC_BASEAPLICACAODTO {
    TEC_BaseAplicacaoId: number;
    TEC_BaseAplicacaoNome: string;
    Eliminar?: boolean
  }
  
  // TEC_PARAMETROBASEPLICACAO.ts
  export interface TEC_PARAMETROBASEPLICACAODTO {
    TEC_ParametroCodigoCliente: number;
    TEC_BaseAplicacaoId: number;
    Eliminar?: boolean
  }
  
  // TEC_CANAL.ts
  export interface TEC_CANALDTO {
    TEC_CanalNome: string;
    TEC_ParametroCodigoCliente: number;
    TEC_BaseAplicacaoId: number;
    Eliminar?: boolean
  }
  
  // USU_USUARIO.ts
  export interface USU_USUARIODTO {
    USU_UsuarioTipo: string;
    USU_UsuarioNome: string;
    USU_UsuarioChave: string;
    TEC_ParametroCodigoCliente: number;
    TEC_BaseAplicacaoId: number;
    Eliminar?: boolean
  }
  export interface USU_USUARIODTO_ALL extends USU_USUARIODTO {
    USU_USUARIOCANAL: USU_USUARIOCANALDTO[];
    USU_USUARIOENDPOINT: USU_USUARIOENDPOINTDTO_ALL[];
    Eliminar?: boolean
  }
  // USU_USUARIOCANAL.ts
  export interface USU_USUARIOCANALDTO {
    USU_UsuarioId: number;
    TEC_CanalId: number;
    Eliminar?: boolean
  }

  export interface USU_USUARIOCANAL_ALLDTO {
    USU_UsuarioId: number;
    TEC_CanalId: number;
    USU_Usuario: USU_USUARIODTO;
    TEC_Canal: TEC_CANALDTO;
    Eliminar?: boolean
  }
  
  // USU_USUARIOENDPOINT.ts
  export interface USU_USUARIOENDPOINTDTO {
    USU_UsuarioId: number;
    TEC_EndpointId: number;
    Eliminar?: boolean
  }
 export interface USU_USUARIOENDPOINTDTO_ALL extends USU_USUARIOENDPOINTDTO {
    TEC_Endpoint: TEC_ENDPOINTDTO;
    Eliminar?: boolean
  }

  
  