{{- define "zoo-common.volumes" -}}
{{- with .Values.volumeMounts }}
volumeMounts:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- with .Values.volumes }}
volumes:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- end }}
