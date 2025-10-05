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
{{ toYaml .Values.extraEnv | nindent 2 }}
{{- end }}
{{- end }}
{{- end }}
