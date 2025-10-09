{{/* HTTP probe */}}
{{- define "zoo-common.httpProbe" -}}
httpGet:
  path: {{ .path }}
  port: {{ .port }}
initialDelaySeconds: {{ .initialDelaySeconds | default 5 }}
periodSeconds: {{ .periodSeconds | default 10 }}
timeoutSeconds: {{ .timeoutSeconds | default 2 }}
failureThreshold: {{ .failureThreshold | default 3 }}
{{- end }}

{{/* TCP probe */}}
{{- define "zoo-common.tcpProbe" -}}
tcpSocket:
  port: {{ .port }}
initialDelaySeconds: {{ .initialDelaySeconds | default 5 }}
periodSeconds: {{ .periodSeconds | default 10 }}
timeoutSeconds: {{ .timeoutSeconds | default 2 }}
failureThreshold: {{ .failureThreshold | default 3 }}
{{- end }}

{{/* Exec probe */}}
{{- define "zoo-common.execProbe" -}}
exec:
  command:
    {{- toYaml .command | nindent 4 }}
initialDelaySeconds: {{ .initialDelaySeconds | default 5 }}
periodSeconds: {{ .periodSeconds | default 10 }}
timeoutSeconds: {{ .timeoutSeconds | default 2 }}
failureThreshold: {{ .failureThreshold | default 3 }}
{{- end }}
