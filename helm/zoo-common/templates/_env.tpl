{{- define "zoo-common.env" -}}
{{- if or .Values.env .Values.extraEnv }}
env:
{{- if .Values.env }}
{{- range $k, $v := .Values.env }}
  - name: {{ $k }}
    value: {{ $v | quote }}
{{- end }}
{{- end }}
{{- if .Values.extraEnv }}
{{- range .Values.extraEnv }}
  - name: {{ .name }}
    {{- if .value }}
    value: {{ .value | quote }}
    {{- else if .valueFrom }}
    valueFrom:
      {{- if .valueFrom.secretKeyRef }}
      secretKeyRef:
        name: {{ include "zoo-common.zoo-db-SecretName" $ }}
        key: {{ .valueFrom.secretKeyRef.key }}
      {{- else }}
      {{- toYaml .valueFrom | nindent 6 }}
      {{- end }}
    {{- end }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
