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
  
  // PSH_USUARIO.ts
  export interface PSH_USUARIODTO {
    PSH_UsuarioTipo: string;
    PSH_UsuarioNome: string;
    PSH_UsuarioChave: string;
    TEC_ClienteCodigo: number;
    TEC_AplicacaoID: number;
  }
  export interface PSH_USUARIODTO_ALL extends PSH_USUARIODTO {
    PSH_USUARIOCANAL: PSH_USUARIOCANALDTO[];
    PSH_USUARIOENDPOINT: PSH_USUARIOENDPOINTDTO_ALL[];
    Eliminar?: boolean
  }
  // PSH_USUARIOCANAL.ts
  export interface PSH_USUARIOCANALDTO {
    PSH_UsuarioId: number;
    TEC_CanalId: number;
    Eliminar?: boolean
  }

  export interface PSH_USUARIOCANAL_ALLDTO {
    PSH_UsuarioId: number;
    TEC_CanalId: number;
    PSH_Usuario: PSH_USUARIODTO;
    TEC_Canal: TEC_CANALDTO;
    Eliminar?: boolean
  }
  
  // PSH_USUARIOENDPOINT.ts
  export interface PSH_USUARIOENDPOINTDTO {
    PSH_UsuarioId: number;
    TEC_EndpointId: number;
    Eliminar?: boolean
  }
 export interface PSH_USUARIOENDPOINTDTO_ALL extends PSH_USUARIOENDPOINTDTO {
    TEC_Endpoint: TEC_ENDPOINTDTO;
    Eliminar?: boolean
  }

  
  